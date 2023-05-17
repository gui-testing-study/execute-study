# Execute-study

# Study with Injected Faults

The data used in the study with injected faults: [csv input estudo empírico.csv](./csv%20input%20estudo%20emp%C3%ADrico.csv). It is a csv divided with lines contained five faults for two applications. Each fault is divided like: `file$string$newString`.


Cytestion tool could be found here: [cytestion.zip](./cytestion.zip). Inside the zip, you will found a **complete** README

TESTAR tool could be found here: https://github.com/TESTARtool/TESTAR_dev.

Need have instaled:

- Docker
- Yarn
- Nodejs
- Python3

## To execute

First, install dependencies:

`yarn install`

Then, init the study objects (repositories):

`init-repos.sh`

Now, in other 4 terminals execute the repositories.

For spring-petclinic use: 

`./mvnw spring-boot:run`

For website-bistro-restaurant use: 

`python3 -m http.server 8070`

For website-learn-educational use: 

`python3 -m http.server 8060`

For website-school-educational use: 

`python3 -m http.server 8050`

### For cytestion

In the parent directory of this, discompact [cytestion.zip](./cytestion.zip).

- Adjust line 51 of `index-cytestion.js` for execute one project per time;

- Adjust line 89 of `index-cytestion.js` for the correct absolute path of the cytestion repository discompacted;

And then:

`node index-cytestion.js | tee ./outputfile.txt`

The script going to insert one fault per time and execute the cytestion.

The output of execution going to outputfile.txt file and the generated test cases going to [cytestion/output](./cytestion/output/).

### TESTAR

In the parent directory:

`git clone https://github.com/TESTARtool/TESTAR_dev.git`

- Adjust line 89 of `index-testar.js` for the correct absolute path of this TESTAR repository cloned;

And then:

`node index-testar.js | tee ./outputfile.txt`

- You can also modify the quantity of actions in: testar/settings/webdriver_generic/Protocol_webdriver_generic.java

The script going to insert one fault per time and execute the TESTAR.

The output of execution going to outputfile.txt and the generated sequences going to [testar/output](./testar/output/).

## Result

- https://drive.google.com/file/d/1N0fDcftPQ-IFhQQjVoA5oDHN7MmgibDM/view?usp=share_link

# Case Study

## Result

- https://drive.google.com/file/d/1aOkmviz-p5uWmlSr5c55Ynk-Vc-1faQQ/view?usp=share_link