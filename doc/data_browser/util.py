import os
filePath = '..\\flower'
files = []
for i,j,k in os.walk(filePath):
  for f in k:
    if f[0]=='.':
      continue
    files.append(f)

# print(files[:5], '...','\n\n')
#   ['IMG_1682.JPG', 'IMG_1683.JPG', 'IMG_1684.JPG', 'IMG_1685.JPG', 'IMG_1686.JPG'] ... 

with open('images.txt', 'w', encoding='utf-8') as file:
  for i in range(len(files)):
    f = files[i]
    file.writelines(f)
    if i < len(files)-1:
      file.writelines('\n')
  file.close()

# import json
# with open('images.json', 'r', encoding='utf-8') as file:
#   data = json.load(file)
#   file.close()
