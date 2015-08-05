/**
*   enjoyCalendar   
*
*   Author Laurent Guyard <lguyard@gmail.com>
*   (c) 2014 Laurent Guyard, u-prod (www.u-prod.com)    
*           
*/
(function($){
    
    $.fn.enjoyCalendar = function(options){
        
        var defaults = {            
            format: 'Y-m-d',
            col: 3,
            dayColor: '#EEE',
            daysColorOver: 'pink',
            daysSelected: 'yellowgreen',
            url: '#',
            events: []
        };

        var colsArr = [];
            colsArr[3] = 32;
            colsArr[4] = 24;
            colsArr[5] = 19;
        var contWidthMin = [];
            contWidthMin[3] = 150;
            contWidthMin[4] = 200;
            contWidthMin[5] = 210;
        
        var monthsCourts = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var params = $.extend(defaults, options);
        var $ec = $(this), $selected = '';
        var cols = colsArr[params.col];
        var now = new Date();
        var current = now;

        // init
        initCalendar(current, 0);

        $ec.css({
            'display': 'inline-block',
            'text-align': 'center',           
        });
        if($ec.width() < contWidthMin[params.col]){
            $ec.css({ 'width': contWidthMin[params.col] });
        }

        var css = '.day, .nav {float:left;width: '+cols+'%; \
                    padding:5px 0;\
                    margin:1px;} \
                   .nav {width: 32%;} \
                   .day a {background-color:'+params.dayColor+'; \
                    width: 2rem; height: 2rem; line-height: 2rem; \
                    text-decoration:none;color:#222; \
                    display: inline-block; border-radius: 2rem;} \
                   .day a:hover, .nav a:hover {background-color:'+params.daysColorOver+'} \
                   .day a.event {background-color:'+params.daysEvent+'} \
                   .day a.selected {background-color:'+params.daysSelected+'} \
                   .today {background-color:'+params.dayColor+'; \
                    border: 1px solid #DDD;display: inline-block;  \
                    margin: 10px auto; padding: 5px 20px;width: 60%; \
                    border-radius: 3px;clear: left;clear: both;} \
                   .today:hover {background-color:'+params.daysColorOver+'; cursor:pointer;} \
                   .nav a {background-color:'+params.dayColor+'; \
                    width: 2rem; height: 2rem; line-height: 2rem; \
                    text-decoration:none;color:#222; \
                    display: inline-block; border-radius: 2rem;} \
                   .currentMonth { line-height: 2rem; text-transform:uppercase;} \
                    ';
        var head = document.head;
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet){
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }            
        head.appendChild(style);
            
    
        function getNbJours(date){
            return new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
        }
        
        function putCurrentMonth(date){            
            $('.currentMonth').text(monthsCourts[date.getMonth()]);
        }  

        function formater(date, j){
            
            var formatedDate = params.format;
                formatedDate = formatedDate.replace(/Y{1,4}/gi, date.getFullYear());
                formatedDate = formatedDate.replace(/m{1,2}/gi, pad(parseInt(date.getMonth()+1),2));
                formatedDate = formatedDate.replace(/d{1,2}/gi, pad(j,2));

            return formatedDate;
        }

        function pad (str, max) {
            str = str.toString();
            return str.length < max ? pad("0" + str, max) : str;
        }

        /**
         * Fonction de récupération des paramètres GET de la page
         * @return Array Tableau associatif contenant les paramètres GET
         */
        function extractUrlParams(){    
            var t = location.search.substring(1).split('&');
            var f = [];
            for (var i=0; i<t.length; i++){
                var x = t[ i ].split('=');
                f[x[0]]=x[1];
            }            
            return f;
        }

        function initCalendar(date,from){
            var $days = '', $daysContainer = '', $nav = '', $navigation = '', $today = '', $display = '';
            
            for ( var i = 1; i <= getNbJours(date); i++){
                $days+= '<div class="day">';
                // event ?
                $events = params.events;
                if($events.length > 0){
                    if($.inArray(formater(date,i), $events) !== -1)
                        $days+= '<a href="'+params.url+formater(date,i)+'" class="event">' + i + '</a>';
                    else
                        $days+= '<a href="'+params.url+formater(date,i)+'">' + i + '</a>';
                        
                        
                }
                $days+= '</div>';

            }
            $daysContainer = $('<div/>', {class:'daysContainer'}).append($days);
            $nav = '<div class="nav prev"><a href="#"><</a></div> \
                        <div class="nav currentMonth">Mois en cours</div> \
                        <div class="nav next"><a href="#">></a></div>';
            $navigation = $('<div/>', {class:'navigation'}).append($nav);
            $today = $('<div/>', {class:'today', text:'today'});
            $display = $('<div/>', {class:'display'}).append($navigation).append($daysContainer);            
            $ec.empty().append($display).append($today);

            var paramGet = extractUrlParams(), ext = false;
            if(from == 0){
                //console.log(Object.keys(paramGet));
                if(Object.keys(paramGet) == "date"){
                    date = paramGet.date;
                    date = new Date(date.replace('-',','));
                    ext = true;
                    console.log(date.getMonth());
                }
            }
            if(date.getFullYear() == now.getFullYear() && date.getMonth() == now.getMonth()){
                if(ext == true)
                var currentDay = date.getDate();
                else
                var currentDay = now.getDate();
                
                $('.display .day a').removeClass('selected');
                $('.day a:contains("'+currentDay+'")')
                    .filter(function(){ return $(this).text() == currentDay})
                    .addClass('selected');
            }            
            putCurrentMonth(date);
            //console.log(current);   

            // next month
            $('.nav.next').on('click', function() {  
                if (current.getMonth() == 11) {
                    current = new Date(current.getFullYear() + 1, 0);
                } else {
                    current = new Date(current.getFullYear(), current.getMonth() + 1);
                }
                $ec.empty();
                initCalendar(current,1);
                return false;
            });
            // prev month
            $('.nav.prev').on('click', function() {            
                if (current.getMonth() == 0) {
                    current = new Date(current.getFullYear() - 1, 11);
                } else {
                    current = new Date(current.getFullYear(), current.getMonth() - 1);
                }            
                $ec.empty();
                initCalendar(current,1);
                return false;
            });
            // today
            $('.today').on('click', function() {
                current = now;
                initCalendar(current,1);
                return false;
            });
            // days
            $('.display .day a').on('click', function() {
                $('.display .day a').removeClass('selected');
                $(this).addClass('selected');
                if(params.url == '#')
                return false;
            });

            
        }
    };
    
})(jQuery);
