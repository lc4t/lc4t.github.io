#! /bin/bash
brew install exiftool imagemagick jq exiv2
exiftool {name} -j| jq '.[0].CreateDate'
mogrify -format jpg *.DNG
exiv2 rm *.jpg