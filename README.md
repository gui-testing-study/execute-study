# execute-study

# cytestion

in the parent directory:

`git clone --branch branch/mestrado https://gitlab.com/lsi-ufcg/cytestion/cytestion.git`

- adjust line 53 for execute one project per time;

- adjust line 89 for the correct absolute path of this cytestion repository cloned;

and then:

`node index-cytestion.js | tee ./outputfile.txt`

# testar

just execute:

`node index-testar.js | tee ./outputfile.txt`

- you can also modify the quantite of actions in: testar/settings/webdriver_generic/Protocol_webdriver_generic.java

the data used in both executions are `csv input estudo empírico.csv`