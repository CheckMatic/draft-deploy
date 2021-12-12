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
                <ProfileCard
                    Picture="https://avatars.githubusercontent.com/u/71444879?v=4"
                    Name="Parth Garg"
                    About="Frontend Developer"
                    LinkedIn="https://www.linkedin.com/in/bhautik-poriya-525601150/"
                    GitHub="https://github.com/BhautikPoriya"
                />
                <ProfileCard
                    Picture="https://avatars.githubusercontent.com/u/71517788?v=4"
                    Name="Harsh Ghodkar"
                    About="Blockchain Developer"
                    LinkedIn="https://www.linkedin.com/in/harsh-ghodkar/"
                    GitHub="https://github.com/Saviour1001"
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