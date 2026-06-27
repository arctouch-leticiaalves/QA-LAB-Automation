#!/usr/bin/env bash
# Runs the Android E2E suite inside the reactivecircus/android-emulator-runner
# step. Lives in a file (not inline in the workflow) because the action invokes
# script: line-by-line via `sh -c`, which breaks any multi-line bash construct
# such as for/while/case. A single-file script avoids the trap entirely.

set -x
set -o pipefail

cd "$GITHUB_WORKSPACE"

echo "::group::Environment versions"
node -v
npm -v
adb devices
echo "::endgroup::"

adb wait-for-device

echo "::group::Wait for boot complete"
boot=""
for i in $(seq 1 90); do
  boot=$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')
  if [ "$boot" = "1" ]; then
    echo "Boot complete (i=$i)"
    break
  fi
  sleep 2
done
if [ "$boot" != "1" ]; then
  echo "::error::Emulator did not finish booting within 180s"
  exit 1
fi
adb shell input keyevent 82 || true
echo "::endgroup::"

echo "::group::Settle launcher (Pixel Launcher tends to ANR on slow emulators)"
# Even after sys.boot_completed=1, the system launcher needs additional time
# on a 2-core software-rendered emulator. Skipping this leads to a
# "Pixel Launcher isn't responding" dialog overlaying the app and breaking
# every accessibility-id lookup in the test suite.
sleep 20
adb shell wm dismiss-keyguard || true
adb shell input keyevent 4 || true
adb shell input keyevent 3 || true
sleep 3
echo "::endgroup::"

echo "::group::Install app under test"
adb install -r -g "$GITHUB_WORKSPACE/apps/android/QA-Lab.apk"
adb shell pm list packages | grep arctouch || {
  echo "::error::App not installed after adb install"
  exit 1
}
echo "::endgroup::"

echo "::group::Pre-launch app + dismiss any system dialogs"
adb shell am start -n com.arctouch.arctouch_demo_app/.MainActivity
sleep 8
# Dismiss any leftover system dialogs (Pixel Launcher ANR, permissions, etc.)
# uiautomator-based dismissal is more targeted than keyevent.
adb shell input keyevent 4 || true
sleep 2
adb shell dumpsys window 2>/dev/null | grep -E "mCurrentFocus|mFocusedApp" | head -2 || true
echo "::endgroup::"

mkdir -p test-results/logs test-results/screenshots test-results/allure-results

export APPIUM_HOME="$GITHUB_WORKSPACE/.appium"
export ANDROID_PLATFORM_VERSION=14
export ANDROID_DEVICE_NAME="$(adb devices | awk 'NR==2{print $1}')"
export ANDROID_UDID="$ANDROID_DEVICE_NAME"
export ANDROID_APP_PACKAGE=com.arctouch.arctouch_demo_app
export ANDROID_APP_ACTIVITY=com.arctouch.arctouch_demo_app.MainActivity
export ANDROID_APP_WAIT_ACTIVITY=com.arctouch.arctouch_demo_app.MainActivity
export ANDROID_APP_PATH="$GITHUB_WORKSPACE/apps/android/QA-Lab.apk"
export ANDROID_NO_RESET=true
export APPIUM_HOST=127.0.0.1
export APPIUM_PORT=4723

echo "::group::Appium server check"
npx appium --version
APPIUM_HOME="$APPIUM_HOME" npx appium driver list --installed
echo "::endgroup::"

TAGS="${TAG_EXPRESSION:-@smoke and @android}"
echo "Running with tag expression: $TAGS"

set +e
npx wdio run wdio.android.conf.ts --cucumberOpts.tags="$TAGS" --logLevel info
WDIO_EXIT=$?
echo "::notice::WDIO exit code: $WDIO_EXIT"

echo "::group::test-results contents"
ls -laR test-results/ 2>&1 | head -100 || true
echo "::endgroup::"

echo "::group::Last 200 lines of every wdio log"
for f in test-results/logs/*.log; do
  [ -f "$f" ] || continue
  echo "----- $f -----"
  tail -200 "$f"
done
echo "::endgroup::"

exit $WDIO_EXIT
