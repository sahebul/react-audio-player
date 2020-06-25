import React,{Component} from 'react';
import {StyleSheet,ScrollView,View,Text,FlatList,ProgressBarAndroid,DeviceEventEmitter,TouchableOpacity} from 'react-native';
import { Header, Button,Divider, Card } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Permissions from 'expo-permissions';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import themes from '../style/themes';
import SeekBar from './SeekBar';
// import MusicFiles from 'react-native-get-music-files';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';


class AudioList extends Component{
  constructor(){
    super()
    this.state={
        audioFiles:[],
        playindex:14,

        isPlaying: false,
        playbackInstance: null,
        volume: 1.0,
        isBuffering: false,
        playedTitle:'',
        progressCount:0,

        totalLength: 1,
     currentPosition: 0,


    }
  }
  renderItem=({item,index})=>{
    const {playindex}=this.state;
    if(playindex === index){

        return (

          <View key={index}>
          <TouchableOpacity onPress={()=>{this.playSelectedTrack(index)

          }}>
          <Text style={{padding:5,color:'#6c0000'}}>{item.filename}</Text>
          </TouchableOpacity>
          </View>
        );

    }else {
      return (

        <View key={index}>
        <TouchableOpacity onPress={()=>{this.playSelectedTrack(index)

        }}>
        <Text style={{padding:5,color:themes.TEXT_COLOR}}>{item.filename}</Text>
        </TouchableOpacity>
        </View>
      );

    }

  }
  _requestPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };
  componentWillMount() {
    // DeviceEventEmitter.addListener(
    //     'onBatchReceived',
    //     (params) => {
    //         this.setState({songs : [
    //             ...this.state.songs,
    //             ...params.batch
    //         ]});
    //     }
    // )
     // this.stopMusic();
}
  async componentDidMount(){
    this._requestPermission();
    this._files();
    try{
    await  Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        shouldDuckAndroid: true,
        staysActiveInBackground: false,
        playThroughEarpieceAndroid: false
      });
    // this.loadAudio();
    }catch(e){
      console.log("error:"+e);
    }

  }

  stopMusic = async () => {
      const {playindex,isPlaying,volume,audioFiles,playbackInstance}=this.state;
  //await this.playbackInstance.stopAsync();
}

  async loadAudio(){
    const {playindex,isPlaying,volume,audioFiles}=this.state;
    try{
      const playbackInstance=new Audio.Sound();
      const source={
        uri:audioFiles[playindex].uri
      }
      const status ={
        shouldPlay:isPlaying,
        volume
      }

      playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)
      await playbackInstance.loadAsync(source,status,false)
      await playbackInstance.playAsync();

      this.setState({isPlaying:true,
        playedTitle:audioFiles[playindex].filename,
        totalLength:Math.floor(audioFiles[playindex].duration),
      })
      this.setState({
        playbackInstance
      })
    }catch(e){
      console.log(e)
    }
  }
  onPlaybackStatusUpdate=status=>{
    console.log("playback status"+JSON.stringify(status))
    var playableDurationMillis=status.playableDurationMillis;
    var durationMillis=status.durationMillis;
    
    var positionMillis=status.positionMillis;
   
    this.setState({
      isBuffering: status.isBuffering,
      isPlaying:status.isPlaying,

    })
    if (status.didJustFinish && !status.isLooping) {
      // The player has just finished playing and will stop. Maybe you want to play something else?
      this.handleNextTrack();
    }

    // let count=0;
    // if(positionMillis === 0){
    //   console.log("inside zerooooooooooooooooooooooooooooooooooooooooooooooooooooo"+count);
    // }else {
    //   count=parseFloat(positionMillis)/parseFloat(playableDurationMillis);
    //   console.log("outside zerooooooooooooooooooooooooooooooooooooooooooooooooooooo"+count.toFixed(1))
    //
    //   if(count !== 'NaN'){
    //     count=count.toFixed(1)
    //     // console.log("outside zerooooooooooooooooooooooooooooooooooooooooo count"+count)
    //     this.setState({
    //       progressCount:count,
    //     })
    //   }
    //
    // }
    
  }
        playSelectedTrack = async (index)=>{
          console.log("play at index of "+index);
        let { playbackInstance } = this.state
        console.log("playback instance of audio player"+(playbackInstance));
          if(playbackInstance){
            await playbackInstance.unloadAsync()
            this.setState({
              playindex:index
            })
              this.loadAudio()

          }else{
            this.setState({
              playindex:index
            })
              this.loadAudio()
          }
        }
        handlePlayPause = async () => {
        const { isPlaying, playbackInstance } = this.state
        isPlaying
          ? await playbackInstance.pauseAsync()
          : await playbackInstance.playAsync()
        this.setState({
          isPlaying: !isPlaying
        })
      }
      handlePreviousTrack = async () => {
        let { playbackInstance, playindex,audioFiles } = this.state
        if (playbackInstance) {
          await playbackInstance.unloadAsync()
          playindex < audioFiles.length - 1
            ? (playindex -= 1)
            : (playindex = 0)
          this.setState({
            playindex
          })
          this.loadAudio()
        }
      }
      handleNextTrack = async () => {
        let { playbackInstance, playindex,audioFiles } = this.state
        if (playbackInstance) {
          await playbackInstance.unloadAsync()
          playindex < audioFiles.length - 1
            ? (playindex += 1)
            : (playindex = 0)
          this.setState({
            playindex
          })
          this.loadAudio()
        }
      }


  seek=(time)=> {

    time = Math.round(time);

    console.log("seek time "+time*10000);
    // this.state.audioFiles && this.state.audioFiles[this.state.playindex].seek(time);
    // this.setState({
    //   currentPosition: time,
    //   paused: false,
    // });
  }


  playMusic=(index)=>{
    this.stopAudio();
    this.payAudio(index);
  }
  _files=async()=>{
    const options={
      mediaType:MediaLibrary.MediaType.audio,
    }
  const asset = await  MediaLibrary.getAssetsAsync(options)
  if(asset.assets.length>0){
    this.setState({
      audioFiles:asset.assets,
    })
  }
  console.log("MusicFiles "+JSON.stringify(asset));
  }

  async payAudio(index){
    this.setState({
      playindex:index
    })
            const soundObject = new Audio.Sound();
            const source = {
          uri: this.state.audioFiles[this.state.playindex].uri,
        };
        try {
          // await soundObject.loadAsync(require('../assets/beep.mp3'));
          await soundObject.loadAsync(source);
          await soundObject.playAsync();
          // Your sound is playing!
        } catch (error) {
          // An error occurred!
        }

  }
  async stopAudio(){

        try {
          await soundObject.stopAsync()
        } catch (e) {

        }

  }

  // _getSongs =() =>{
  //     //Alert.alert('seen')
  //     MusicFiles.getAll({
  //             id : true,
  //             blured : false,
  //             artist : true,
  //             duration : true, //default : true
  //             cover : true, //default : true,
  //             title : true,
  //             cover : true,
  //             batchNumber : 5, //get 5 songs per batch
  //             minimumSongDuration : 10000, //in miliseconds,
  //             fields : ['title','artwork','duration','artist','genre','lyrics','albumTitle']
  //          }).then(tracks => {
  //            console.log("MusicFiles"+JSON.stringify(tracks))
  //          }).catch(error => {
  //          console.log("error"+error)
  //     })
  //   }
  render(){
    console.log("playing at index"+this.state.progressCount);
    return(

       <View style={{flex:1}}>

       <Header
         statusBarProps={{ barStyle: 'light-content' }}
         barStyle="light-content"
         leftComponent={
           <FontAwesome name="music"
             color={themes.THEME_TEXT_COLOR}
             size={20} />

          }
         centerComponent={{ text: 'Music', style: { color: themes.THEME_TEXT_COLOR,fontSize: 20, } }}
         containerStyle={
           {backgroundColor:themes.THEME_COLOR}
         }

       />



       <FlatList
       data={this.state.audioFiles}
       renderItem={this.renderItem}
       keyExtractor={(item,index)=>index.toString()}
       ListFooterComponent={()=>(<View style={{height:100}}></View>)}
       />




       <View style={styles.bottomView}>
       <View style={{flexDirection:'row',paddingTop:10,paddingBottom:10}}>
          <MaterialIcons
          name="audiotrack"
          style={{paddingLeft:10}}
          size={20}/>
          <Text numberOfLines={1} style={{paddingLeft:5,fontSize:14}}>{this.state.playedTitle}</Text>
      </View>

      <SeekBar
          onSeek={this.seek.bind(this)}
          trackLength={this.state.totalLength}
          onSlidingStart={() => this.setState({paused: true})}
          currentPosition={this.state.currentPosition} />



       <View  style={{flexDirection:'row',justifyContent:'space-between',paddingTop:10,paddingBottom:20,paddingLeft:40,paddingRight:40}}>
         <Entypo
           name="controller-jump-to-start"
           size={25}
           color="#000000"
           onPress={()=>{
             this.handlePreviousTrack()
           }}
         />
         <Entypo
           name={(this.state.isPlaying) ? "controller-paus":"controller-play"}
           size={25}
           color="#000000"
           onPress={()=>{
             this.handlePlayPause()
           }}
         />
         <Entypo
           name="controller-next"
           size={25}
           color="#000000"
           onPress={()=>{
             this.handleNextTrack()
           }}
         />
       </View>
       </View>
    </View>


    )
  }
}
export default AudioList;
const styles=StyleSheet.create({
  container:{
    backgroundColor:themes.BACKGROUND_COLOR,
  },
  bottomView:{
    width:'100%',
    flex:1,
    bottom:0,
    position:'absolute',
    backgroundColor:themes.FOOTER_COLOR
  }
})
