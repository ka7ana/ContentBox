/**
* ContentBox - A Modular Content Platform
* Copyright since 2012 by Ortus Solutions, Corp
* www.ortussolutions.com/products/contentbox
* ---
* Unenroll users from two-factor authentication on provider change
*/
component extends="coldbox.system.Interceptor"{

    // DI
    property name="twoFactorService"    inject="id:TwoFactorService@cb";
    property name="securityService" 	inject="id:securityService@cb";


    variables.allowedEvents = [
        "contentbox-admin:authors.forceTwoFactorEnrollment",
        "contentbox-admin:authors.enrollTwofactor",
        "contentbox-admin:authors.forceTwoFactorEnrollment",
        "contentbox-admin:authors.doTwoFactorEnrollment"
    ];


    /**
    * Configure
    */
    function configure(){}

    /**
     *
     */
    public void function preProcess( required any event, required struct interceptData, buffer, rc, prc ) {
        var oCurrentAuthor = securityService.getAuthorSession();

        if ( ! oCurrentAuthor.getLoggedIn() ) {
            return;
        }

        if ( ! twoFactorService.isForceTwoFactorAuth() ) {
            return;
        }

        if ( oCurrentAuthor.getIs2FactorAuth() ) {
            return;
        }

        if ( arrayContains( allowedEvents, rc.event ) ) {
            return;
        }

        event.overrideEvent( "contentbox-admin:authors.forceTwoFactorEnrollment" );
    }

}
