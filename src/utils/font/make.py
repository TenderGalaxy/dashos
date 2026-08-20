from PIL import ImageFont
import json
import numpy as np
import os

font = ImageFont.truetype(os.path.join(os.path.dirname(__file__), "ttf", "micro-h5.ttf"), size = 8, layout_engine=ImageFont.Layout.BASIC)
data = {}

for char in map(chr, range(32, 200)):
    mask = font.getmask(char)
    width, height = mask.size
    if height == 11: continue
    pixels = [1 if i > 0 else 0 for i in mask]

    #print('\n'.join([''.join(map(str, i)) for i in list(np.array(['#' if i else ' ' for i in pixels]).reshape(height, width))]))
    #print('')
    data[char] = {
        'width': width,
        'height': height,
        'pixels': ''.join(map(str, pixels))
    }
with open(os.path.join(os.path.dirname(__file__), 'fonts', 'default.json'), 'w') as f:
    json.dump(data, f, indent=2)
with open(os.path.join(os.path.dirname(__file__), 'fonts', 'defaultMeta.json'), 'w') as f:
    json.dump({
        'height': 5
    }, f, indent=2)