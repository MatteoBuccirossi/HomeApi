import requests
from gtts import gTTS 
import os 
import time

memory = 'iii'

def getJson():
    request = requests.get('http://buccihouse.xyz/message')
    resJson = request.json()
    global memory
    resId = resJson['body'][0]['id']
    
    if resId != memory:
        message = resJson['body'][0]['text']
        lan = resJson['body'][0]['lang']
        tts = gTTS(text=message, lang=lan)
        tts.save("message.mp3")

        os.system('ffplay -autoexit message.mp3')
        print('new message')
        print(lan)
        memory = resId
    else:
        print('nothing new')
    
  

while True:
    getJson()
    time.sleep(3)
        
        
    
