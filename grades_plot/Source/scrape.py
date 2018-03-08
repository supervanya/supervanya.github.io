import requests
import json
import sys
from bs4 import BeautifulSoup
from pprint import pprint
import re

csv = []

# open HTML file
sylabus = open("Videogames & Learning.html", 'r')
sylabus_contents = sylabus.read()
sylabus.close()


# get HTML of the page
# extract beautiful soup from it
soup = BeautifulSoup(sylabus_contents, "html.parser")

assignments = soup.find_all(class_="assignment_type student")

for category in assignments:
    # assignmentid = category["id"]
    as_kind = category.find(class_="assignment-type-name").text
    # print(as_kind)
    for assignment in category.find_all(class_="assignment-container"):
        # print(type(assignment))

        # find the name of the asignment
        name_tag = assignment.find(class_="assignment-name")
        name = assignment.find("a").text

        try:
            points_text = assignment.find(class_="assignment-info assignment-points").text.strip()
            points_text_list = points_text.split()
            i = points_text_list.index("points") - 1
            points = points_text_list[i].replace(",", '')
            # points = re.findall('\d+ points', pages_soup.text)
            # print(name + " - " + points)

            string = "'{}'-'{}',{}".format(as_kind, name, points)
            csv.append(string)
        except:
            print(assignment.find(class_="assignment-info assignment-points"))

    # print("-"*20)

for line in csv:
    print(line)


#
# points = soup.find_all(class_="assignment-container")
# predicted_points = soup.find_all(class_="assignment-container predicted)
#
# for i in points:
#     name = i.find(class_="assignment-name")
#     points = i.find(class_="assignment-name")
#     type = i.find(class_="assignment-info assignment-points")
#     print (i.text)
#
# # iterate through every person
# for person in people:
#     # find the name of the person
#     name_soup = person.find(class_="field field-name-title field-type-ds field-label-hidden")
#     name = name_soup.text
#     # get the url of the person's 'contact details' page
#     person_url_soup = person.find(
#         class_="field field-name-contact-details field-type-ds field-label-hidden")
#     person_url_soup = person_url_soup.find("a")
#     person_url_tag = person_url_soup["href"]
#     person_url = "https://www.si.umich.edu"+person_url_tag
#
#     # get inforamtion from the details page
#     info = get_persons_data(person_url)
#
#     # add the details to the dictionaty
#     umsi_titles[name] = info
