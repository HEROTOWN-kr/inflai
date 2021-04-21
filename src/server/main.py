#my_name = 'Carlos'
#my_age = 18 # not a lie
#my_height = 172 # cm
#my_weight = 71 # kg
#my_eyes = 'Brown'
#my_teeth = 'White'
#my_hair = 'Black'
#
#print("Let's talk about %s." % my_name)
#print("He's %d centimeters tall." % my_height)
#print("He's %d kilograms heavy." % my_weight)
#print("Actually that's not too heavy.")
#print("He's got %s eyes and %s hair." % (my_eyes, my_hair))
#print("His teeth are usually %s depending on the coffee." % my_teeth)
#
## this line is tricky, try to get it exactly right
#print("If I add %d, %d, and %d I get %d. I don't know what that means but, whatever." % (my_age, my_height, my_weight, my_age + my_height + my_weight))

import requests
from bs4 import BeautifulSoup
from urllib.request import urlopen
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pprint as pp
import sys

PageUrl = 'https://m.blog.naver.com/PostList.nhn?blogId={}'.format(sys.argv[1])

headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '3600',
    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'
    }

page = urlopen(PageUrl).read()


def parse(url):
    driver = webdriver.Chrome('C:/Users/HEROTOWN/Desktop/ANDRIAN/projects/python/chromedriver_win32/chromedriver.exe')
    driver.get(url)
    try:
        WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.CLASS_NAME, "count_buddy")))

    except:
        pp.pprint("Exception")

    finally:
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        followers = soup.select(".count_buddy")[0].prettify()
        followersText = soup.select(".count_buddy")[0].text
        followersText = followersText.split("ㆍ")
        followersText = [k for k in followersText if '명의' in k]
        followersText = followersText[0].replace('명의 이웃', '')
        print(followersText)
        #print(sys.argv)
        driver.quit()
        return soup

parse(PageUrl)
