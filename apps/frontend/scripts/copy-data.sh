#!/bin/bash
mkdir -p /vercel/share/v0-project/public/data
cp /vercel/share/v0-project/user_read_only_context/text_attachments/readable_decoded-kNj3H.json \
   /vercel/share/v0-project/public/data/markers.json
echo "Copied markers.json to public/data/"
