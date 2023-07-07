#! /bin/bash
brew install exiftool imagemagick jq exiv2
for fname in `ls *.JPG`; do
  newname=`exiftool $fname -j| jq '.[0].CreateDate' | sed 's/\:/-/g' | sed 's/"//g'`
  mogrify -format jpg $fname
  mv ${fname%%.*}.jpg "$newname.jpg" && rm -f $fname
  echo "$fname => $newname.jpg"
done
# exiftool {name} -j| jq '.[0].CreateDate'
# mogrify -format jpg *.DNG
exiv2 rm *.jpg