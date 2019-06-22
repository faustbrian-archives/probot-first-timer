#!/bin/sh
now="npx now --debug --token=$NOW_TOKEN"

echo "$ now rm --safe --yes first-timer"
$now rm --safe --yes first-timer

echo "$ now --public"
$now --public

echo "$ now alias"
$now alias
