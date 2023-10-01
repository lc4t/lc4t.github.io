#! /bin/bash
brew install exiftool imagemagick jq exiv2

# 首次直接运行下面的即可
for fname in `ls *.HEIC`; do
  newname=`exiftool $fname -j| jq '.[0].CreateDate' | sed 's/\:/-/g' | sed 's/"//g'`
  mogrify -format jpg $fname
  mv ${fname%%.*}.jpg "$newname.jpg" && rm -f $fname
  echo "$fname => $newname.jpg"
done
# exiftool {name} -j| jq '.[0].CreateDate'
# mogrify -format jpg *.DNG
exiv2 rm *.jpg

# 删掉不要的文件
# 每天只保留一个
# 时间戳
for file in *.jpg; do
    # 提取日期部分
    date_part=${file:0:10}
    # 创建新的文件名
    new_name="$date_part.jpg"
    # 重命名文件
    mv "$file" "$new_name"
done