import React,{Component} from 'react';
import {StyleSheet,View,Text} from 'react-native';
import { Header, Button,Divider, Card } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import themes from '../style/themes';
import AudioList from './AudioList';
class Player extends Component{
  constructor(){
    super()
    this.state={

    }
  }
  render(){
    return(
      <View>

    


      </View>
    )
  }
}
export default Player;
const styles=StyleSheet.create({
  container:{
    backgroundColor:themes.BACKGROUND_COLOR
  },
  bottomView:{
    width:'100%',
    bottom:0,
    position:'absolute',
    backgroundColor:"#2c8275"
  }
})
