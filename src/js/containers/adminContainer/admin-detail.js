import React, {Component} from 'react';

import {connect} from 'react-redux';


class AdminDetail extends Component{
    render(){ 
        if(!this.props.admin){ //If there is no user selected render below
                return(<h4>Please Log In</h4>);
            }
        return(
           //when  prop user is selected render below
            <div>
                <h1> Its Reading a User </h1>
                <h2>{this.props.admin.entityData.firstName} {this.props.admin.entityData.lastName}</h2>
                <h3>{this.props.admin.entityData.username}</h3>

            </div>
        );
    }
}
//maps the state to the activer user selected as  prop user
    const mapStateToProps = (state, ownProps) => {
        return {
            admin: state.activeAdmin 
        }
    }



    //Exports state and connects it to UserDetail component only
    export default connect(mapStateToProps)(AdminDetail);