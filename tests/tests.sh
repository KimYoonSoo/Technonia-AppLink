#!/bin/sh
ANDROID_ENDPOINT="http://localhost:8080/applink/android"
APPLE_ENDPOINT="http://localhost:8080/applink/apple"

API_METHOD="GET"

echo $ANDROID_ENDPOINT
echo $APPLE_ENDPOINT
echo $API_METHOD
echo "\r\n"

echo "Android AppLink Test"
curl -X $API_METHOD $ANDROID_ENDPOINT/com.technonia.android -w %{http_code}
echo "\r\n"

echo "Apple AppLink Test"
curl -X $API_METHOD $ANDROID_ENDPOINT/com.technonia.apple -w %{http_code}
echo "\r\n"

echo "Failed Test"
curl -X $API_METHOD $ANDROID_ENDPOINT -w %{http_code}
echo "\r\n"

echo "Failed Test"
curl -X $API_METHOD $ANDROID_ENDPOINT/invalid -w %{http_code}
echo "\r\n"

