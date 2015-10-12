#!/bin/bash
echo Copying files over.
cp -v -r demo-app-master /run/user/1000/gvfs/smb-share:server=joomlah-pc,share=users/joomlah/dev/Overwolf
echo Copy complete!
