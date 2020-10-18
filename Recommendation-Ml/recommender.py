# Food recommender system

import pandas as pd
import numpy as np
from flask import Flask,jsonify
app = Flask(__name__)

@app.route('/recommendation/height=<ht>/weight=<wt>')
def recommendation(ht,wt):
    cols=['Food and Serving','Calories']
    df = pd.read_csv('Food.csv',usecols=cols,engine='python')
    df.drop(index=0,inplace=True)

    tmp=[i.split() for i in df['Food and Serving']]
    size=[]
    for i in tmp:
        try:
            if i[-3].startswith('('):
                inew=str(i[-3])[1:]
                size.append(int(inew))
            else:
                size.append(1)
        except:
            size.append(1)

    df['weight']=size
    df['Unit_cal']=df['Calories']/df['weight']

    bmi_dict={'22':0.25,'21':0.22,'26':0.25,'30':0.30,'15':0.12,'19':0.20,'42':0.35} #'bmi':'cal/g'
    #bmi_dict can be used for LR to predict cal for given bmi
    #bmi_and_cal=pd.DataFrame()
    #bmi_and_cal['bmi']=['22','21','26','30','15','19','42']
    #bmi_and_cal['cals']=[0.25,0.22,0.25,0.30,0.12,0.20,0.35]
    #features=bmi_and_cal['bmi']
    #features=np.asarray(features)
    #features=features.reshape((len(features),1))
    #labels=bmi_and_cal['cals']
    #from sklearn.linear_model import LinearRegression
    #model=LinearRegression()
    #model.fit(features,labels)

    
    ht=int(ht)
    wt=int(wt)
    bmi=0

    bmi=str(int(wt/(ht*ht)))
    unitcal=bmi_dict[bmi]
    #bmi=np.asarray(bmi).reshape((1,1))
    #unitcal=model.predict(bmi) 
    #unitcal=int(unitcal)

    idx=[]
    iteration= list(df['Unit_cal'])
    for val in iteration:
        if (val >= (unitcal-0.0001)) or (val<=(unitcal+0.0001)):
            idx.append(iteration.index(val))
    idx=np.array(idx)
    idx=np.unique(idx)
    idx=list(idx)
    df.iloc[idx,0]

    recommended=[i.split(',')[0] for i in df.iloc[idx,0]]
    print(recommended)

    recommended_display={
    #"height":ht,
    #"weight":wt,
    "bmi":bmi,
    "recommended_foods":recommended        
    }

    return jsonify(recommended_display)

app.run()
