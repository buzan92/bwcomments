<template>
<el-container>
    <el-button type="primary" icon="el-icon-edit" @click="call()">Ответить</el-button>
    <el-collapse>
        <el-collapse-item v-for="(comment, index) in comments" :key="index" :title="formatDate(comment.createdate)" :name="index">
            <div>
                <img :src="comment.photo">
                {{comment}} {{index}}
            </div>
        </el-collapse-item>
    </el-collapse>
    
</el-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'


export default {
    data () {
        return {
            comments: []
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
        call: function() {
            console.log('Call click fire=)');
            this.$socket.emit('mevent', 'AaaaAAASzAAAsssA');
        },
        formatDate: function(date) {
            return moment.unix(date).format('DD/MM/YYYY hh:mm');
        }
    },
    created() {
        axios.post('http://localhost:3100/api/getcomments/', {
            clientid: 1
        })
        .then((response) => {
            this.comments = response.data.data;
            console.log(response.data.data);
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

