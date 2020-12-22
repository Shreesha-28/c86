import React, { Component } from 'react';
import { StyleSheet, Text, View,TouchableOpacity,TextInput,Modal,ScrollView,KeyboardAvoidingView} from 'react-native';
import db from'../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import {Card,Icon,ListItem,} from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler';

export default class MyDonationScreen extends Component{
    static navigationOptions={header:null}

    constructor(){
        super();
        this.state={
            donorId:firebase.auth().currentUser.email,
            allDonations:[],
            donorName:''
        }
        this.requestRef=null
    }
    getDonorDetails=(donorId)=>{
        db.collections("users").where('email_id','==',donorId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    "donorName":doc.data().first_name+""+doc.data().last_name
                })
            })
        })
    }

    getAllDonations=()=>{
        this.requestRef=db.collection("all_donations").where("donor_id","==",this.state.donorId)
        .onSnapshot((snapshot)=>{
            var allDonations=[]
            snapshot.docs.map
            ((doc)=>{
                var donation=doc.data()
                    donation["doc_id"]=doc.id
                    allDonations.push(donation)
                
            })
            this.setState({
                allDonations:allDonations
            })
        })
    }
    sendBook=(bookDetails)=>{
        if(bookDetails.request_satus==="Book Sent"){
            var requestStatus="Donor Interested"
            db.collection("all_donations").doc(bookDetails.doc_id).update({
                "request_status":"Donor Interested"
            })
            this.sendNotification(bookDetails,requestStatus)
        }
        else {
            var requestStatus="Book Sent"
            db.collection("all_donations").doc(bookDetails.doc_id).update({
                "request_status":"Book Sent"
            })
            this.sendNotification(bookDetails,requestStatus)

        }
    }
    sendNotification=(bookDetails,requestStatus)=>{
        var requestId=bookDetails.request_id
        var donorId=bookDetails.donor_id
        db.collection("all_notfications").where("request_id","==",requestId)
        .where("donor_id","==",donorId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
            var message=""
            if(requestStatus==="Book Sent"){
                message=this.state.donorName+"sent you book"
            }
            else {
                message=this.state.donorName+"Has Shown Interest In Donating The Booka"
            }
            })
        })
    }
    keyExtractor=(item,index)=>index.toString()

    renderItem=({item,i})=>(
        <ListItem key={i}
        title={item.book_name}
        subtitle={"Requested by: "+item.requested_by+"Status: "+item.request_status}
        leftElement={<Icon name="book" type="font-awesome" color="#696969"/>}
        titleStyle={{color:'black',fontWeight:'bold'}}
        rightElement={
            <TouchableOpacity style={styles.button}>
                <Text style={{color:'#ffff'}}>send book</Text>
            </TouchableOpacity>
        }
        bottomDivider/>
    )
    componentDidMount(){
        this.getAllDonations()
    }
    componentWillUnmount(){
        this.requestRef()
    }
    render(){
        return(
            <View style={{flex:1}}
            >
                <MyHeader title="donate books" navigation={this.props.navigation}/>
                <View style={{flex:1}}>
                    {
                        this.state.allDonations.length===0
                        ?(
                            <View style={styles.subContainer}>
                                <Text style={{fontSize:20}}>list of all donations</Text>
                                </View>
                        ):(
                            <FlatList
                            keyExtractor={this.keyExtractor}
                            data={this.state.allDonations}
                            renderItem={this.renderItem}/>
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