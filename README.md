# EnjoyCalendar
Another jquery calendar

## Requires
* jQuery

## Installation
Include enjoyCalendar

```
<script src="lib/enjoyCalendar.js"></script>
```

## Usage
Add a div with ID and declare plugin

```
<script>
$(function(){
    $('#calendar').enjoyCalendar();
});	
</script>
```

### With options

```
<script>
$(function(){
    $('#calendar').enjoyCalendar({
    	format: 'Y-m-d',
    	col: 3, // 3, 4 or 5
        dayColor: '#EEE',
        daysColorOver: 'pink',
        daysSelected: 'yellowgreen',
        daysEvent: 'orange',
        url: 'index.html?date=',
        events: ['2015-04-15','2015-04-11','2015-04-04']
    });
});	
</script>
```


## Todo
Make Other Options
