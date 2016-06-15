<template>
    <div class="homepage animated page" 
         v-show="isshow"
         :transition="tran"
         @scroll="flush()"
    >
        <div class="weui_cells">
            <a class="weui_cell weui_cells_access node_cell" href="javascript:;" v-for="topic in topics" v-link="{path : '/topic/' + topic.id}">
                <div class="weui_cell_hd">
                    <img :src="topic.author.avatar_url" style="width:40px;margin-right:10px;display:block">
                </div>
                <div class="weui_cell_bd weui_cell_primary">
                    <p class="footer">
                        <span>{{topic.author.loginname}}</span>
                        <span>{{ topic.last_reply_at | timeago }}</span>
                    </p>
                    <p class="title">{{topic.title}}</p>
                    <p class="footer">
                        <span>{{ topic.tab | tabtype }}
                            <font style='color:green;'>{{ topic.good ? "&nbsp;精" : '' }}</font>
                            <font style='color:red;'>{{ topic.top ? "&nbsp;顶" : '' }}</font>   
                        </span>
                        <span>{{topic.reply_count}}/{{topic.visit_count}}</span>
                    </p>
                </div>
                <div class="weui_cell_ft"></div>
            </a>
        </div>
    </div>
    <loading :isshow="$loadingRouteData"></loading>
</template>
<script>
    export default {
        data() {
            return {
                topics : '',
                page : 1,
                tran : 'left',
                type : 'all',
                isshow : 'true'
            }
        },
        route : {
            data( transition ) {
                //先从session中取
                if( transition.to.params.type ) {
                    this.type = transition.to.params.type;
                }
                let datastr = sessionStorage.getItem( this.type );
                if( datastr ) {
                    transition.next({topics:JSON.parse(datastr)});
                } 
                else {
                    //如果不存在，则从服务器取
                    return this.loaddata().then(( data )=>{
                        sessionStorage.setItem( this.type,JSON.stringify( data.data ) );
                        return {
                            topics : data.data
                        }
                    }).always(()=>{
                        this.$loadingRouteData = false;
                    });
                }
            },
            canReuse() {
                this.isshow = false;
                setTimeout(()=>{
                    this.isshow = true;
                },600);
                return true;
            }
        },
        methods : {
            loaddata : function( page ) {
                let url = `${rootPath}api/v1/topics?tab=${this.type}&page=${this.page}`;
                if( page ) {
                    url = `${rootPath}api/v1/topics?tab=${this.type}&page=${page}`;
                }
                
                this.$loadingRouteData = true;
                return $.ajax({
                    url : url,
                    dataType : 'json'
                });
            },
            flush : function() {
                if( this.$loadingRouteData ) {
                    return;
                }

                let totalheight = parseFloat($(".page").height() + $(".page").scrollTop());
                if( $(".weui_cells").height() <= totalheight ) {
                    this.page ++;
                    this.loaddata().then(( data )=>{
                        this.topics = this.topics.concat(data.data);
                        sessionStorage.setItem( this.type,JSON.stringify( this.topics ) );
                        $(".page").animate({
                            scrollTop : $(".page").scrollTop() + $(".page").height() / 2
                        },500);
                    }).always(()=>{
                        this.$loadingRouteData = false;
                    });
                } else {
                    if( $(".page").scrollTop() <= 0 ) {
                        this.loaddata(1).then(( data )=>{
                            //从现有的数据中弹出40个，再加入
                            this.topics = data.data.concat(this.topics.slice(39));
                            sessionStorage.setItem( this.type,JSON.stringify( this.topics ) );
                        }).always(()=>{
                            this.$loadingRouteData = false;
                        });
                    }
                }
            },
            onSwipeLeft : function() {
                this.tran = 'left';
                if( this.type == 'all' ) {
                    router.go("/home/ask");
                } else if( this.type == 'ask' ) {
                    router.go("/home/share");
                } else if( this.type == 'share' ) {
                    router.go("/home/good");
                } else if( this.type == 'good' ) {
                    router.go("/home/job");
                }
            },
            onSwipeRight : function() {
                this.tran = 'right';
                if( this.type == 'job' ) {
                    router.go("/home/good");
                } else if( this.type == 'good' ) {
                    router.go("/home/share");
                } else if( this.type == 'share' ) {
                    router.go("/home/ask");
                } else if( this.type == 'ask' ) {
                    router.go("/home/all");
                }
            }
        }
    }
</script>