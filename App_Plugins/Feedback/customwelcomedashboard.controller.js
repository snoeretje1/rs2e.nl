angular.module("umbraco")
    .controller("CustomWelcomeDashboardController",
        function(
            $scope,
            $http,
            umbRequestHelper,
            notificationsService,
            $element) {

            const FEEDBACK_SUBMITED = "";

            function openModal() {
                document.getElementById("feedbackModal").style.display = "block";
            }

            function closeModal() {
                document.getElementById("feedbackModal").style.display = "none";
            }

            function onWindowClick(event) {
                if (event.target === document.getElementById("feedbackModal")) {
                    closeModal();
                }
            }

            $element[0].querySelector("#openModal").addEventListener("click", openModal);
            $element[0].querySelector("#closeModal").addEventListener("click", closeModal);
            window.addEventListener("click", onWindowClick);

            $scope.send = function(name, email, comments, star) {
                if (name != null && email != null) {
                    $scope.isAgreed = false;
                    var FeedbackModel = {
                        feedbackName: name,
                        feedbackEmail: email,
                        feedbackStar: star,
                        feedbackComments: comments,
                        feedbackProjectName: "OskiStarterKit"
                    };
                    $scope.name = null;
                    $scope.email = null;
                    $scope.star = null;
                    $scope.comments = null;
                    $scope.hidden = false;

                    umbRequestHelper.resourcePromise(
                        $http.post("https://crm00.com/umbraco/api/UserReviews/SaveResultUserReviews", FeedbackModel),
                        "Something went wrong, try sending again").then(function() {
                            notificationsService.success("Thank you, your feedback is important to us");

                            // Reset the form's state
                            $scope.feedback.$setPristine();
                            $scope.feedback.$setUntouched();

                            localStorage.setItem(FEEDBACK_SUBMITED, "true");
                            closeModal();

                        },
                        function(err) {
                            notificationsService.error(err.errorMsg + "! Status code " + err.status);
                            console.log(err);
                        });
                } else {
                    $scope.isAgreed = false;
                    notificationsService.error("\"Name\" and \"email\" fields must be filled in");
                }
            };

            $scope.$on("$destroy",
                function() {
                    window.removeEventListener("click", onWindowClick);
                });

            if (!localStorage.getItem(FEEDBACK_SUBMITED)) {
                openModal();
            }
        });