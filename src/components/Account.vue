<template>
  <h1>ADKSPSKS </h1>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
    data () {
        return {
            comments: [],
            replyLoading: false
        }
    },
    methods: {
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
        /*
        axios.post('http://localhost:3000/api/getcomments/', {
            clientid: 1
        })
        .then((response) => {
            this.comments = response.data.data;
        })
        .catch((err) => {
            console.log(err);
        });
        */
    }
}
</script>

