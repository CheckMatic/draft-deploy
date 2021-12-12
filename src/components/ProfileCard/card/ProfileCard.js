import React from "react";
import "./ProfileCard.css";
import "bootstrap/dist/css/bootstrap.min.css";


const ProfileCard = ({ }) => {
	return (
		<section class="section-team">
			<div class="container">
				<div class="row justify-content-center text-center">
					<div class="col-md-8 col-lg-6">
						<div class="header-section">
							<h3 class="small-title">Checkmatic</h3>
							<h2 class="title">Meet Our Team - #BUIDL</h2>
						</div>
					</div>
				</div>
				<div class="row">

					<div class="col-sm-6 col-lg-4 col-xl-3">
						<div class="single-person">
							<div class="person-image">
								<img src="https://user-images.githubusercontent.com/71517788/145711620-5475702d-eac6-477f-b133-bdf77f58c4d2.jpeg" alt="" />
								<span class="icon">
									<a href="https://github.com/Saviour1001"><img src="https://img.icons8.com/ios-glyphs/30/000000/github.png" /></a>
								</span>
							</div>
							<div class="person-info">
								<h3 class="full-name">Harsh Ghodkar</h3>
								<span class="speciality">Team Lead & Blockchain Dev</span>
							</div>
						</div>
					</div>

					<div class="col-sm-6 col-lg-4 col-xl-3">
						<div class="single-person">
							<div class="person-image">
								<img src="https://user-images.githubusercontent.com/69706506/145712590-240fd404-aa22-4109-a96f-eddffc0f7190.jpeg" alt="" />
								<span class="icon">
									<a href="https://github.com/avishmehta68710"><img src="https://img.icons8.com/ios-glyphs/30/000000/github.png" /></a>
								</span>
							</div>
							<div class="person-info">
								<h3 class="full-name">Avish Mehta</h3>
								<span class="speciality">Backend Developer</span>
							</div>
						</div>
					</div>

					<div class="col-sm-6 col-lg-4 col-xl-3">
						<div class="single-person">
							<div class="person-image">
								<img src="https://avatars.githubusercontent.com/u/20561864?s=400&u=3ffea7317dbcd2b92e22ff6a930751a149901017&v=4" alt="" />
								<span class="icon">
									<a href="https://github.com/ParthGada"><img src="https://img.icons8.com/ios-glyphs/30/000000/github.png" /></a>
								</span>
							</div>
							<div class="person-info">
								<h3 class="full-name">Parth Gada</h3>
								<span class="speciality">Frontend Developer</span>
							</div>
						</div>
					</div>


				</div>
			</div>
		</section>

	);
};
export default ProfileCard;
