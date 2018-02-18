<template>
<el-container>
    
    <el-tabs tab-position="left">
        <el-tab-pane v-for="(comment, index) in comments" :key="index" :label="formatDate(comment.createdate)">
            <el-card class="comment-card">
                <img :src="comment.photo" class="image">
                <p>{{comment.content}}</p> 
            </el-card>

            <el-card v-for="(replay, index) in comment.reply" :key="index" class="reply-card">
                <p>{{formatDate(replay.createdate)}}</p>
                <p>{{replay.content}}</p>
            </el-card>

            <el-form :inline="true" :model="replyform" :rules="replyrules" ref="replyform" class="reply-form">
                <el-form-item prop="text" class="reply-input">
                    <el-input type="textarea" autosize v-model="replyform.text"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-edit" :loading="replyLoading" @click="reply(comment._id, comment.chatid, comment.msgid, replyform, index)">Ответить</el-button>
                </el-form-item>
            </el-form>            

        </el-tab-pane>
    </el-tabs>
    
    
</el-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'


export default {
    data () {
        return {
            comments: [],
            replyLoading: false,
            replyform: {
                text: ''
            },
            replyrules: {
                text: [{ required: true, message: 'Пожалуйста введите ответ на отзыв', trigger: 'blur' }]
            }
        }
    },
    sockets:{
        connect: function(){
            console.log('socket connected')
        },
        customEmit: function(val){
            console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
        }
    },
    methods: {
        reply: function(commentid, chatid, msgid, replyform, index) {
            if (replyform.text) {
                this.replyLoading = true;
                axios.post('http://localhost:3100/api/replycomment/', {
                    commentid: commentid,
                    chatid: chatid,
                    msgid: msgid,
                    content: replyform.text
                })
                .then((response) => {
                    this.replyLoading = false;
                    if (response.data.success) {
                        this.$message({
                            message: response.data.msg,
                            type: 'success'
                        });
                        this.comments[index].reply.push({
                            createdate: Date.now()/1000,
                            content: replyform.text
                        });
                    } else {
                        this.$message({
                            message: response.data.msg,
                            type: 'warning'
                        });
                    }
                })
                .catch((err) => {
                    this.replyLoading = false;
                    console.log(err);
                });
            }
            /*
            const obj = {
                id: comment._id,
                content: 'jaAdajs oa ois soa josjsao'
            }
            this.$socket.emit('mevent', obj);
            */
        },
        call: function() {
            //console.log('Call click fire=)');
            //this.$socket.emit('mevent', 'AaaaAAASzAAAsssA');
            this.comments.unshift({
                new: true,
                createdate: 1518664647,
                msg: 'SSAAA!@$######'
            });
        },
        formatDate: function(date) {
            return moment.unix(date).format('HH:mm DD.MM.YYYY');
        }
    },
    created() {
        axios.post('http://localhost:3100/api/getcomments/', {
            clientid: 1
        })
        .then((response) => {
            this.comments = response.data.data;
        })
        .catch((err) => {
            console.log(err);
        });
    }
}
</script>

<style scoped>
.el-container {
    flex-direction: column;
}
</style>

