import React, { Component } from 'react';
import { StyleSheet, Text, View,TouchableOpacity,TextInput,Modal,ScrollView,KeyboardAvoidingView} from 'react-native';
import db from'../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import { block } from 'react-native-reanimated';

export default class BookRequestScreens extends Component{
    constructor(){
        super();
        this.state={
            userId:firebase.auth().currentUser.email,
            bookName:"",
            reasonToRequest:"",
            isBookRequestActive:"",
            requestedBookName:"",
            bookStatus:"",
            requestId:"",
            userDocId:"",

        }
    }
    createUniqueId(){
        return Math.random().toString(36).substring(6)
    }
    addRequest=async(bookName,reasonToRequest)=>{
        var userId=this.state.userId;
        var randomRequestId=this.createUniqueId()
        db.collection('requested_book').add({
            "user_id":userId,
            "book_name":bookName,
            "reason_to_request":reasonToRequest,
            "request_id":randomRequestId,
            "book_status":"requested"
        })
        await this.getBookRequest()
        db.collection("users").where('email_id','==',userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                db.collection('users').doc(doc.id).update({
                    isBookRequestActive:true
                })
                })
            })
               this.setState({
            bookName:'',
            reasonToRequest:'',
            requestId:randomRequestId
        })
        return alert("book Requested Succefully")
    }
    receivedBooks=(bookName)=>{
        var userId=this.state.userId
        var requestId=this.state.requestId
        db.collection('received_books').add({
            "user_id":userId,
            "book_name":bookName,
            "request_id":requestId,
            "bookStatus":"received"
        })
    }
    getIsBookRequestActive(){
        db.collection("users").where('email_id','==',this.state.userId)
        .onSnapshot((querySnapshot)=>{
            querySnapshot.forEach((doc)=>{
                this.setState({
                    isBookRequestActive:doc.data().isBookRequestActive,
                    userDocId:doc.id
                })
            })
        })
    }
    getBookRequest=()=>{
        var bookRequest=db.collection('requested_books')
        .where('user_id','==',this.state.userId)
        .get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                if(doc.data().book_status!=="received"){
                    this.setState({
                        requestId:doc.data().request_id,
                        requestedBookName:doc.data().book_name,
                        bookStatus:doc.data().book_status,
                        docId:doc.id
                    })
                }
            })
        })
    }
    sendNotification=()=>{
        db.collection('users').where('email_id','==',this.state.userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                var name=doc.data().first_name
                var lastName=doc.data().last_name

                db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
               var donorId=doc.data().donor_id
               var bookName=doc.data().book_name
               
               db.collection('all_notification').add({
                   "targeted_user_id":donorId,
                   "message":name+" "+lastName+"received the book"+bookName,
                   "notification_status":'unread',
                   "book_name":bookName
                
                })
            })
        })
            })
        })
    }
    componentDidMount(){
        this.getBookRequest();
        this.getIsBookRequestActive()
    }
    updateBookRequestStatus=()=>{
        db.collection('requested_book').doc(this.state.docId).update({
            book_status:'received'
        })
        db.collection('users').where('email_id','==',this.state.userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                db.collection('users').doc(doc.id).update({
                    isBookRequestActive:false
                })
            })
        })
    }
    render(){
        if(this.state.isBookRequestActive===true){
            return(
                <View style={{flex:1,justifyContent:'center'}}>
                    <View style={{backgroundColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
                        <Text>book name</Text>
                        <Text>{this.state.requestedBookName}</Text>
                    </View>
                    <View style={{backgroundColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
                        <Text>book status</Text>
                        <Text>{this.state.bookStatus}</Text>
                    </View>
                    
                    <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:'orange',width:300,alignItems:'center',alignSelf:'center',height:30,marginTop:30}}
                    onPress={()=>{
                        this.sendNotification()
                        this.updateBookRequestStatus();
                        this.receivedBooks(this.state.requestedBookName)
                    }}
                    >
                        <Text>I received the book</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else{
        return(
            <View style={{flex:1}}>
                <MyHeader title="request book"
                navigation={this.props.navigation}/>
                <KeyboardAvoidingView style={styles.keyboardStyles}>
                <TextInput
                            style={styles.formTextInput}
                            placeholder={"enter book name"}
                          
                            onChangeText={(text)=>{
                                this.setState({
                                    bookName:text
                                })
                            }}
                            value={this.state.bookName}
                            />
                                                        <TextInput
                            style={[styles.formTextInput,{height:300}]}
                            placeholder={"why do you need the book"}
                            numberOfLines={8}
                            multiline={true}
                            onChangeText={(text)=>{
                                this.setState({
                                    reasonToRequest:text
                                })
                            }}
                            value={this.state.reasonToRequest}
                            />
                            <TouchableOpacity style={styles.button}
                            onPress={()=>{this.addRequest(this.state.bookName,this.state.reasonToRequest)}}>
                                <Text>request</Text>
                            </TouchableOpacity>

                </KeyboardAvoidingView>
            </View>
        )}
    }
}
const styles=StyleSheet.create({
    keyboardStyles:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    formTextInput:{
        width:"75%",
        height:35,
        alignSelf:'center',
        borderColor:'#ffab91',
        borderRadius:10,
        borderWidth:1,
        marginTop:20,
        padding:10
    },
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
})