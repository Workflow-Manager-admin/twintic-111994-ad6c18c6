#!/bin/bash
cd /home/kavia/workspace/code-generation/twintic-111994-ad6c18c6/twin_tic
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

