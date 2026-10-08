/* we are  going to import few things from the package */
import {PayPalButtons, PayPalScriptProvider} from "@paypal/react-paypal-js";

const PayPalButton = ({ amount, onSuccess, onError }) =>  {
    return(
        /* this is where we will pass the client ID */
        /* WE WILL HARDCODE THE VLAUE HERE BU LATER WE WILL MAKE USE OF THE .ENV FILE */
        <PayPalScriptProvider options={{"client-id" :
         import.meta.env.VITE_PAYPAL_CLIENT_ID,
         }} >
            <PayPalButtons style={{layout: "vertical"}}
            createOrder={(data, actions) => {
                return actions.order.create({
                         /* IN Paypal   button component we are sending the amount directly  like this 
                         let us ensure that we pass the float values to have proper decimal Precision this way we will 
                         avoid decimal Precision error that can get encountered using the Paypal payment method 
                         */
                    purchase_units: [{amount:  {value: parseFloat(amount).toFixed(2)  }}]
                })
            }}
            onApprove={(data, actions) => {
                return actions.order.capture().then(onSuccess)
            }}
            onError={onError} />

        </PayPalScriptProvider>
    )
};
export default PayPalButton;




// Here I got sth else when I click the button "Continue to Pay"
// the buttons of Paypal Payments dsose not appear
// it immeatly takes me a blank page with the same URL