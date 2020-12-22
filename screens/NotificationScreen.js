import React, { Component } from 'react';
import { StyleSheet, Text, View,TouchableOpacity,TextInput,Modal,ScrollView,KeyboardAvoidingView} from 'react-native';
import db from'../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import {Card,Icon,ListItem,} from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler';
import SwipableFlatlist from '../components/SwipableFlatlist'

export default class MyNotificationScreen extends Component{
    static navigationOptions={header:null}

    constructor(props){
        super(props);
        this.state={
            userId:firebase.auth().currentUser.email,
            allNotifications:[]
        }
        this.notificationRef=null
    }

    getNotifications=()=>{
        this.notificationRef=db.collection("all_notifications").where("notification_status","==","unread")
        .where("targeted_user_id",'==',this.state.userId)
        .onSnapshot((snapshot)=>{
            var allNotifications=[]
            snapshot.docs.map((doc)=>{
                var notification=doc.data()
                notification["doc_id"]=doc.id
                allNotifications.push(notification)
            })
            this.setState({
                allNotifications:allNotifications
            })
            console.log(this.state.allNotifications)
        })
    }
    keyExtractor=(item,index)=>index.toString()

    renderItem=({item,i})=>{
        return(
        <ListItem key={i}
        title={item.book_name}
        leftElement={<Icon name="book" type="font-awesome" color="#696969"/>}
        subtitle={item.message}
        titleStyle={{color:'black',fontWeight:'bold'}}
        bottomDivider/>
        )
        }
    componentDidMount(){
        this.getNotifications()
    }
    componentWillUnmount(){
        this.notificationRef()
    }
    render(){
        return(
            <View style={{flex:1}}
            >
                <MyHeader title="notifications" navigation={this.props.navigation}/>
                <View style={{flex:1}}>
                    {
                        this.state.allNotifications.length===0
                        ?(
                            <View style={styles.subContainer}>
                                <Text style={{fontSize:20}}>yuo have no notifications</Text>
                                </View>
                        ):(
                        <SwipableFlatlist allNotifications={this.state.allNotifications}/>
                            )
                    }
                </View>
            </View>
        )
    }
    
}
const styles=StyleSheet.create({
    button:{
        width:300,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:25,
        backgroundColor:"#ff9800",
        shadowColor:'#000',
        shadowOffset:{
            width:0,
            height:8,
        },
        shadowOpacity:0.30,
        shadowRadius:10.32,
        elevation:16
    },
    subContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    subTitle:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        fontSize:20
    },
})