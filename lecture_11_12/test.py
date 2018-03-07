from bs4 import BeautifulSoup

f = open("hello.html")
html = f.read()
soup = BeautifulSoup(html, 'html.parser')

print(soup[3])
