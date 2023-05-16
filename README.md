# execute-study

first, init the repositories:

`init-repos.sh`

now, in other 4 terminals execute the repositories.

for spring-petclinic use: 

`./mvnw spring-boot:run`

for website-bistro-restaurant use: 

`python3 -m http.server 8070`

for website-learn-educational use: 

`python3 -m http.server 8060`


for website-school-educational use: 

`python3 -m http.server 8050`

# cytestion

in the parent directory:

`git clone --branch branch/mestrado https://gitlab.com/lsi-ufcg/cytestion/cytestion.git`

- adjust line 53 of `index-cytestion.js` for execute one project per time;

- adjust line 89 of `index-cytestion.js` for the correct absolute path of this cytestion repository cloned;

and then:

`node index-cytestion.js | tee ./outputfile.txt`

# testar

- adjust line 90 of `index-testar.js` for the correct absolute path of this cytestion repository cloned;

and then:

`node index-testar.js | tee ./outputfile.txt`

- you can also modify the quantite of actions in: testar/settings/webdriver_generic/Protocol_webdriver_generic.java

the data used in both executions are `csv input estudo empírico.csv`