import requests
from bs4 import BeautifulSoup
from urllib.request import urlopen
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pprint as pp
import sys

PageUrl = 'https://blog.naver.com/PostList.nhn?blogId={}'.format(sys.argv[1])


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
        WebDriverWait(driver, 0.5).until(EC.presence_of_element_located((By.CLASS_NAME, "category_title")))


    except Exception as e:
        print(e)
        return 'end'

    finally:
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        followers = soup.select(".category_title")[0].prettify
        followersText = soup.select(".category_title")[0].text
        followersText = followersText.split(" ")
        followersText = [k for k in followersText if '개의' in k]
        followersText = followersText[0].replace('개의', '')
        print(followersText)
        driver.quit()
        # print(sys.argv)

        return soup

parse(PageUrl)
