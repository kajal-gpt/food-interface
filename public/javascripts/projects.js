$(document).ready(function(){
    $.getJSON('/interface/fetch_foodtype',function(data){
        data.map((item)=>{
            $('#foodS').append($('<option>').text(item.foodtypes).val(item.foodtypeid))
            console.log()
        })
        
    })
    $('#foodS').change(function(){
        $.getJSON('/interface/fetch_hotel',{foodtypeid:$('#foodS').val()},function(data){
            $('#hotel').empty()
            $('#hotel').append($('<option>').text('-Select Hotel-'))
            data.map((item)=>{
                $('#hotel').append($('<option>').text(item.hotelname).val(item.hotelsid))
            })
        })
    })

    $.getJSON('/interface/fetch_hotel',function(data){
        data.map((item)=>{
            $('#hotel').append($('<option>').text(item.hotelname).val(item.hotelsid))
            console.log()
        })
          $('#hotel').change(function(){
        $.getJSON('/interface/fetch_dish',{hotelsid:$('#hotel').val()},function(data){
            $('#dish').empty()
            $('#dish').append($('<option>').text('-Select dish-'))
            data.map((item)=>{
                $('#dish').append($('<option>').text(item.dishname).val(item.dishid))
            })
        })
        console.log(data)
    })
  
    })
  

})
