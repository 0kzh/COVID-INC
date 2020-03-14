import requests
import urllib.request
import urllib.parse
import urllib.error
from bs4 import BeautifulSoup
import ssl
import json
import os
import time

def getlinks(locationid, url):
    try:
        html = urllib.request.urlopen(url, context=ctx).read()
        soup = BeautifulSoup(html, 'html.parser')
        script = soup.find('script', text=lambda t: \
                        t.startswith('window._sharedData'))
        page_json = script.text.split(' = ', 1)[1].rstrip(';')
        data = json.loads(page_json)
        images_links = []
        post_links = []
        print ('Scraping links with IG locationid: ' + locationid +"...........")
        for post in data['entry_data']['LocationsPage'][0]['graphql'
            ]['location']['edge_location_to_top_posts']['edges']:
            images_links.append(post['node']['thumbnail_resources'][1]['src'])
            print(post['node']['shortcode'])
            post_links.append(post['node']['shortcode'])
            if len(images_links) == 8: break
        lat = data['entry_data']['LocationsPage'][0]['graphql'
            ]['location']['lat']
        lng = data['entry_data']['LocationsPage'][0]['graphql'
            ]['location']['lng'] 
        return {"lat" : lat, "long" : lng, "links" : images_links, "urls": post_links}
    except:
        print("Error resolving location ID #" + str(locationid))
        return {"lat" : "40.70", "long" : "-74.0060", "links" : [], "urls": []}


def populateloc(file):
    with open(file, 'r') as openfile: 
        # Reading from json file 
        opened = json.load(openfile) 
    for locs in opened['locations']: #populate
        if locs.get('troll') or locs.get('troll') == 1:
            continue
        scraped = getlinks(locs['id'],'https://www.instagram.com/explore/locations/' + locs['id'] + '/')
        if not locs.get('lat'):
            locs.update({"lat" : str(scraped.get('lat'))})
        if not locs.get('long'):
            locs.update({'long' : str(scraped.get('long'))})
        if not locs.get('photos') and scraped.get('links'):
            locs['photos'].clear()
        
        for link in scraped.get('links'):
            if link not in locs['photos']: 
                locs['photos'].append(link)
        
        if not locs.get('urls') and scraped.get('urls'):
            locs['urls'].clear()
        
        for url in scraped.get('urls'):
            if url not in locs['urls']: 
                locs['urls'].append(url)
    # Write new loc
    with open(file, "w") as outfile: 
        json.dump(opened, outfile, indent=4) 

#FETCH
while(True):
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    # populate loc files in directory with hot photo links
    path = "./locations"
    directory = os.fsencode(path)
    for file in os.listdir(directory):
         filename = os.fsdecode(file)
         if filename.endswith(".json"):
            populateloc(path + "/" + filename)
            time.sleep(5) # delay requests by 5 seconds
    time.sleep(300) # call every 5 mins
            
