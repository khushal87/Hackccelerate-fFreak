# fFreak

fFreak is a health and fitness tracking web application (PWA) which lets you manage all your fitness activity and lead towards good health.
#### This repository has the recommendation engine for the web application.

recommender.py contains the code for recommending foods based on BMI value of user. User BMI is calculated from his/her weight and height data, and calorie requirement corresponding to the BMI is estimated.
The estimated calorie count is then compared with the calories present in different food items from the Food.csv dataset. 
##### The closest matched items are added in a list and showcased at the end.

## Installation

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install fFreak.

```
cd Recommendation-Ml
Run the recommender.py file.
Copy the URL that shows up(http://127.0.0.1:5000/) and paste it in the browser.
Concatenate /recommendation/height=<h>/weight=<w> to the URL.
(For example, the URL for height=1 and weight=21 is http://127.0.0.1:5000/recommendation/height=1/weight=21)
Hit enter and the page will display the BMI and recommended food list in json format.
Stop the script after returning to the python console.
```

## Disclaimer
This repository was built for the event [Hackccelerate-2020](https://www.hackerearth.com/challenges/hackathon/hackccelerate-2020/) organized by hackerearth