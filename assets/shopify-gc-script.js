var repeatCustomers = [];

function makeid() {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 16; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function createGiftCard(email) {
  email = email.replace(/\.$/,"")
  jQuery.ajax("https://country-shore-outfitters.myshopify.com/admin/customers/dropdown?query="+email)
  .always(function(html,status,response){
    
    if(html.match(/customerDropdown.pick\((\d+),/) && html.match(/customerDropdown.pick\((\d+),/)[1]) {
      var id = html.match(/customerDropdown.pick\((\d+),/)[1]

      $.ajax({
        method: "POST",
        url: "https://country-shore-outfitters.myshopify.com/admin/gift_cards",
        data: { 
          gift_card: {
            code: makeid(),
            initial_value: 5,
            customer_id: id,
            never_expires: "off",
            note: ""
          }
        }
      })
      .always(function( msg ) {
        console.log("DONE")
      });
    } else {
      setTimeout(function(){
        console.log("OK. We'll try again in 3 seconds")
        createGiftCard(email)
      },3000)
    }
  })
}

function createUsersWithGiftCards() {
  
  var emailString = prompt("Give me those fucking emails!", "");
  
  jQuery.each(emailString.split(","), function(i,email){
  
  
    jQuery.ajax({
      method: "POST",
      url: "https://country-shore-outfitters.myshopify.com/admin/customers",
      data: { 
        customer: {
          email: email,
          accepts_marketing: 1,
          tax_exempt: 0,
          origin: "merchant"
        }
      }
    })
    .done(function( msg ) {
      createGiftCard(email)
    })
    .fail(function( msg ) {
      repeatCustomers.push(email)
      createGiftCard(email)
    })
  })
    
}

createUsersWithGiftCards();
setInterval(function(){ console.log(repeatCustomers) },6000)