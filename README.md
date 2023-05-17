# Execute-study

The data used in both executions are [csv input estudo empírico.csv](./csv%20input%20estudo%20emp%C3%ADrico.csv). It is a csv divided with lines contained five faults for two applications each.

### To execute

First, init the repositories:

`init-repos.sh`

Install dependencies:

`yarn install`

Now, in other 4 terminals execute the repositories.

For spring-petclinic use: 

`./mvnw spring-boot:run`

For website-bistro-restaurant use: 

`python3 -m http.server 8070`

For website-learn-educational use: 

`python3 -m http.server 8060`

For website-school-educational use: 

`python3 -m http.server 8050`

# cytestion

In the parent directory:

`git clone --branch mestrado https://gitlab.com/lsi-ufcg/cytestion/cytestion.git`

- Adjust line 53 of `index-cytestion.js` for execute one project per time;

- Adjust line 89 of `index-cytestion.js` for the correct absolute path of this cytestion repository cloned;

And then:

`node index-cytestion.js | tee ./outputfile.txt`

# TESTAR

In the parent directory:

`git clone https://github.com/TESTARtool/TESTAR_dev.git`

- Adjust line 90 of `index-testar.js` for the correct absolute path of this cytestion repository cloned;

And then:

`node index-testar.js | tee ./outputfile.txt`

- You can also modify the quantite of actions in: testar/settings/webdriver_generic/Protocol_webdriver_generic.java
