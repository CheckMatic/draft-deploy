import React from "react";
import ProfileCard from "./card/ProfileCard";
import "./Profile.css";

function Profile() {
    return (
        <div className="profile container">
            <div className="text"> Our Beloved Team </div>
            <div className="profiles">
                <ProfileCard
                    Picture="https://user-images.githubusercontent.com/69706506/145709821-fad76fe0-241b-4e1b-83f5-763f3b994b2f.jpeg"
                    Name="Avish Mehta"
                    About="Backend Developer"
                    LinkedIn="https://www.linkedin.com/in/avishmehta/"
                    GitHub="https://github.com/avishmehta68710"
                />
                
            </div>
        </div>
    );
}

const ProfileCards = () => {
    return (
        <div>
            <Profile />
        </div>
    );
};

export default ProfileCards;
