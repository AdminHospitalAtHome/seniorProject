import React, {useState, useEffect, Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    button
} from 'react-native';
import GoogleFit, { Scopes } from 'react-native-google-fit';
//var [weight, setWeight] = useState(0);
//global.result = [];


export default class WeightScreen extends Component {

 state={weight: 0};
 updateState=(value)=>{this.setState({weight: value})};
  getWeight() {
        //const [result, setResult] = useState([]);
        var today = new Date();
        var lastMonthDate = new Date(
            today.getFullYear(),
            today.getMonth() - 1,
            today.getDate(),
        );
        const opt = {
              startDate: lastMonthDate.toISOString(), // required ISO8601Timestamp
              endDate: today.toISOString(),
              unit: 'kg', // required; default 'kg'
              bucketUnit: 'HOUR', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
              bucketInterval: 1, // optional - default 1.
              ascending: false, // optional; default false
            };

        GoogleFit.getWeightSamples(opt).then((res) => {
          console.log(res);
          //this.updateState(res[0].value);
          //console.log("first log: " + this.state.weight);
          //setResult(res[0].value);
          //console.log(res[0].value);

          //this.getResult(res);
          //console.log("result " + result);
        });
        //return (result);
        //console.log("result out: " + result);
    };

  render() {
  console.log("second log: " + this.state.weight);
  const options = {
             scopes: [
               Scopes.FITNESS_ACTIVITY_READ,
               Scopes.FITNESS_ACTIVITY_WRITE,
               Scopes.FITNESS_BODY_READ,
               Scopes.FITNESS_BODY_WRITE,
             ],
           };
      GoogleFit.checkIsAuthorized().then(() => {
            var authorized = GoogleFit.isAuthorized;
            console.log(authorized);
            if (authorized) {
              const doSth = this.getWeight();
              //console.log("work?: " + doSth);
            } else {
              // Authentication if already not authorized for a particular device
              GoogleFit.authorize(options)
                .then(authResult => {
                  if (authResult.success) {
                    console.log('AUTH_SUCCESS');

                    // if successfully authorized, fetch data
                  } else {
                    console.log('AUTH_DENIED ' + authResult.message);
                  }
                })
                .catch(() => {
                  dispatch('AUTH_ERROR');
                });
              }
            });
  return(

    <View style={[{flex: 1}]}>
          <View style={styles.row}>
            <View style={[styles.row_2, styles.containerBlue]}>
              <Text style={styles.textContainerBlue}>Weight</Text>
            </View>
            <View style={[styles.row_2, styles.containerWhite]}>
              <Text style={styles.textContainerWhite}> hhh </Text>
            </View>
          </View>

          <View style={styles.row}>
                  <View style={[styles.row_2, styles.containerBlue]}>
                     <Text
                             onPress={() => this.forceUpdate()}
                             >
                             update
                           </Text>
                  </View>

                </View>

        </View>
      );
  };
};

const styles = StyleSheet.create({
 row: {
     flexDirection: 'row',
     height: 30,
     margin: 10,
     marginTop: 12,
   },
   row_2: {
     flex: 2,
   },
   containerBlue: {
     marginTop: 10,
     height: 50,
     backgroundColor: '#187FA1',
     color: 'white',
   },
   textContainerBlue: {
     paddingTop: 15,
     paddingLeft: 15,
     color: 'white',
   },
   textContainerWhite: {
     paddingTop: 15,
     paddingLeft: 70,
     color: '#187FA1',
   },
});

AppRegistry.registerComponent('WeightScreen', () => WeightScreen);
