<template>
    <div class="topicpage">
        <div class="hd">
            <div class="headimg">
                <img :src="topic.author.avatar_url" alt="">
            </div>
            <div class="headtitle">
                <p>{{topic.title}}</p>
                <p style="font-size:12px;color:#cccccc;">
                    {{topic.author.loginname}}
                    <span>{{ topic.tab | tabtype }}
                        <font style='color:green;'>{{ topic.good ? "&nbsp;精" : '' }}</font>
                        <font style='color:red;'>{{ topic.top ? "&nbsp;顶" : '' }}</font>   
                    </span>
                </p>
            </div>
        </div>
        <div class="bd weui_article">
            {{{topic.content}}}
            <div class="weui_cells">
                <div class="weui_cell node_cell" v-for="item in topic.replies">
                    <div class="weui_cell_bd weui_cell_primary content">
                        <p class="footer">
                            <span>
                                <img :src="item.author.avatar_url" style="width:20px;margin-right:5px;display:inline-block">
                            </span>
                            <span>{{item.author.loginname}}</span>
                            <span>{{ item.create_at | timeago }}</span>
                        </p>
                        <p>{{{ item.content }}}<p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <loading :isshow="$loadingRouteData"></loading>
</template>
<script>
    export default {
        data() {
            return {
                topic : {
                    author : {},
                    replies : [
                        {author : {}}
                    ]
                }
            }
        },
        route : {
            data : function( transition ) {
                let id = transition.to.params.id;
                let url = `${rootPath}api/v1/topic/${id}`;
                return $.ajax({
                    url : url,
                    dataType : 'json'
                }).then((data)=>{
                    //缓存文章数据
                    // sessionStorage.setItem(id,JSON.stringify(data.data));
                    return {
                        topic : data.data
                    }
                });
            }
        }
    }
</script>