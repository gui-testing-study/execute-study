# execute-study

the data used in both executions are `csv input estudo empírico.csv`. it is a csv divided with each line contained five faults for two applications:

1_aplicacao | 1_aplicacao_url | 1_falta_1  | 1_falta_2 | 1_falta_3 | 1_falta_4 | 1_falta_5 | 2_aplicacao | 2_aplicacao_url | 2_falta_1 | 2_falta_2 | 2_falta_3 | 2_falta_4 | 2_falta_5

### to execute

first, init the repositories:

`init-repos.sh`

install dependencies:

`yarn install`

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

in the parent directory:

`git clone https://github.com/TESTARtool/TESTAR_dev.git`

- adjust line 90 of `index-testar.js` for the correct absolute path of this cytestion repository cloned;

and then:

`node index-testar.js | tee ./outputfile.txt`

- you can also modify the quantite of actions in: testar/settings/webdriver_generic/Protocol_webdriver_generic.java
