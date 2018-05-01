/****** height set (incase) ****/
var clientHeight = $(window).height();
var footerHeight = $('footer').outerHeight(true);

$('#top').css('height', clientHeight);
$('body').css('margin-bottom', footerHeight);

/****** Preloader *******/
$(window).on("load", function() {
    setTimeout(function(){
        $( ".preloader, .loader" ).addClass( "finished" );
    }, 2000);
});

/********* Menu toggle ******/
$("#menu-toggle, .main-nav ul li").click(function(){
    $('.nav-wrap').removeAttr( "style");
    $('#top nav, .nav-wrap, .menu-button').toggleClass("menu-on menu-off");

    if($( "#menu-toggle" ).hasClass( "menu-on" )){
        $('html').css("overflow", "hidden");
    }else{
        $('html').removeAttr( "style" );
    }
});

/***** Menu ancher scroll *****/
$('.main-nav ul li a, .hire-social a').click(function(e) {
    e.preventDefault();
    var anchorName = this.hash;
    //console.log($(anchorName).offset().top);
    $('html, body').animate({
        scrollTop: $(anchorName).offset().top + 77
    }, 500);
    //console.log('its clicked');
});



/****** Slider data Ajax******/

var ajaxhttp = new XMLHttpRequest();
var url = "data/projects.json";

ajaxhttp.open("GET", url, true);
//console.log(url,ajaxhttp);

ajaxhttp.setRequestHeader("content-type", "application/json");

ajaxhttp.onreadystatechange = function () {
    if(ajaxhttp.readyState === 4 && ajaxhttp.status === 200)
    {
        var projects = JSON.parse(ajaxhttp.responseText);
        renderPROJECTS(projects);

        /****** Slider call function ******/
        $("#lightSlider").lightSlider({
            item: 3,
            autoWidth: false,
            slideMove: 1, // slidemove will be 1 if loop is true
            slideMargin: 0,
            mode: "slide",
            cssEasing: 'ease', //'cubic-bezier(0.25, 0, 0.25, 1)',//
            easing: 'linear', //'for jquery animation',////
            responsive : [
                {
                    breakpoint:768,
                    settings: {
                        item: 4,
                        enableDrag : false,
                        enableTouch : false

                    }
                }
            ]
        });
        // $('.view-button').on('click', function () {
        //     console.log('view project has been clicked');
        // });
        modalApperance ();
        modalDeatais(projects);

    }
};
ajaxhttp.send(null);

/***** Rendering projects to page *****/
function renderPROJECTS(data) {
    var htmlString = '';

    for(var project in data){
        var singleProject = data[project];
        // console.log('<li style="background-image: url(\'images' + singleProject.thumbnail + '\')">');
        htmlString += '<li project-data=\"'+ singleProject.id +'\">';
        htmlString += '<div class="project-img-overlay" style="background-image: linear-gradient(rgba(0, 0, 0, 0.39), rgba(19, 19, 19, 0.9)), url(\'images/project_img' + singleProject.thumbnail + '\')"></div>';
        htmlString += '<div class="project-titles">';
        htmlString += '<h3>'+singleProject.title +'</h3>';
        htmlString += '<h5 class="view-button">View Project</h5>';
        htmlString +=  "</div></li>";
    }
    //console.log(typeof htmlString)
    $('#lightSlider').append( htmlString);

}

/***** click event for modal ****/
function modalApperance () {
    //Click event for class changes for Modal to show and hid
    $('#lightSlider li h5, .closebtn').on('click', function () {
        //check which element is being clicked on
        if ($(this).attr('class') !== 'closebtn') {
            //have modal display, have clases active and deactive added when needed
            $('#modal').removeAttr("style");
            if (!$('#modal').hasClass('active') && !$('#modal').hasClass('deactivate')) {
                $('#modal').addClass('active');

            } else {
                $('#modal').toggleClass("active deactivate");
            }
            //when modal is activate have page scroll locked
            $('html').css("overflow", "hidden");
        } else if ($(this).attr('class') === 'closebtn') {
            $('#modal').toggleClass("active deactivate");

            $('html').removeAttr('style');
        }

    });
}
function modalDeatais (data) {
    //Click event is for all content and info that need to be shown for each project
    $('#lightSlider li').on('click', function () {
        var projectId = $(this).attr('project-data');
        var singleData = data[projectId - 1];
        var skills = singleData.skills;
        var imageObj = singleData.images;
        var newHTML = [];
        //Add in list of skills to modal
        $.each(skills, function(index, value) {
            newHTML.push('<li>' + value + '</li>');
        });
        $(".modal-list").html(newHTML.join(""));

        //add in project descriptions
        $('.project-description').html(singleData.description );
        var projectImg = 'images/project_img'.concat(imageObj['group']);
        $(".project-img").css("background-image",'url(' + projectImg + ')' );

        //console.log(singleData.link);
        var htmlLink = ' ';
        if(singleData.link !== null){
            console.log(singleData.link);
            htmlLink += '<li class="link"><a href="'+ singleData.link + '"  target="_blank"> ';
            htmlLink += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" class="linkbtn">';
            htmlLink += '<circle stroke-width="2" stroke-miterlimit="10" cx="26" cy="26" r="25"></circle>';
            htmlLink += '<path stroke-width="2" stroke-miterlimit="10" d="M25.5,20.7l4-4c1.3-1.3,3.4-1.3,4.7,0l1,1 c1.3,1.3,1.3,3.4,0,4.7l-5.6,5.6c-1.3,1.3-3.4,1.3-4.7,0"></path>';
            htmlLink += '<path stroke-width="2" stroke-miterlimit="10" d="M26.3,31.5l-3.7,3.7c-0.6,0.6-1.5,1-2.4,1 c-0.9,0-1.7-0.3-2.4-1l-1-1c-1.3-1.3-1.3-3.4,0-4.7l5.6-5.6c1.3-1.3,3.4-1.3,4.7,0l1,1"></path>';
            htmlLink += '</svg>';
            htmlLink += '</a></li>';
            $('.modal-button ul').append(htmlLink);
            var link = '<a href="' + singleData.link + '"> Link to Project</a>';
            $('.project-detail .link').html(link);
        }else{
            $('.modal-button ul .link, .project-detail .link a' ).remove();
        }

    });
}

/****** For particel background *******/
$(function () {
    particlesJS("particles-js", {
        particles: {
            number: {value: 57, density: {enable: true, value_area: 800}},
            color: {value: "#b7d7cf"},
            shape: {
                type: "circle",
                stroke: {width: 1, color: "#b7d7cf"},
                polygon: {nb_sides: 4},
                image: {src: "img/github.svg", width: 100, height: 100}
            },
            opacity: {
                value: 0.5,
                random: false,
                anim: {enable: false, speed: 1, opacity_min: 0.1, sync: false}
            },
            size: {
                value: 3,
                random: true,
                anim: {enable: false, speed: 40, size_min: 0.1, sync: false}
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 6,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {enable: false, rotateX: 600, rotateY: 1200}
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {enable: false, mode: "repulse"},
                onclick: {enable: false, mode: "push"},
                resize: true
            },
            modes: {
                grab: {distance: 400, line_linked: {opacity: 1}},
                bubble: {distance: 400, size: 40, duration: 2, opacity: 8, speed: 3},
                repulse: {distance: 200, duration: 0.4},
                push: {particles_nb: 4},
                remove: {particles_nb: 2}
            }
        },
        retina_detect: true
    });
});
/**** For nav to be sticky after entering profile block ***/
$(function() {

    var lastScrollTop = 0;
    var inHeaderDiv = false;
    var passedHeaderDivOnce = false;
    var runOnceImageChangeProfile = false;

    $(window).scroll(function(){
        var st = $(this).scrollTop();

        var between = (($(window).scrollTop() <= $(window).height()) && ($(window).scrollTop() >= 0));

        //if and else statment to detect if scrolling up or down
        if (st > lastScrollTop){
            // if
            if ($(window).scrollTop() >= $(window).height()) {
                $('nav').removeClass('slide-out');
                $('nav').addClass('sticky');
                // Reset the value for both inheader and passed header.
                inHeaderDiv = false;
                passedHeaderDivOnce = true;
            }
        } else {
            // if scrolling up then
            if (between && !inHeaderDiv && passedHeaderDivOnce) {
                //console.log("You've scrolled up and are in  header");
                $('nav').toggleClass('sticky fade-out');

                $('nav').animate({
                    opacity : 0
                }, 300, function () {
                    $(this).removeClass('fade-out');
                    $(this).removeAttr('style');
                    $(this).addClass('slide-out');
                    setTimeout(function() {
                        $('nav').removeClass('slide-out');
                    }, 500);
                });
                inHeaderDiv = true;
                //console.log(inHeaderDiv);
            }

        }
        lastScrollTop = st;

        //Profile image change for mobile
        function mobileImageChange() {
            $('.profile-image').attr('src', $('.profile-image').data("hover"));
            setTimeout(function(){
                $('.profile-image').attr('src', $('.profile-image').data("src"));
                //console.log($('.profile-image').data("src"));
            },3000);
        }
        var windowSize = $(window).width();
        var profileDiv = ($(window).scrollTop() >= $('#profile').offset().top);

        //image changes first time on scroll
        if(windowSize <= 480 && profileDiv && !runOnceImageChangeProfile) {
            //console.log('its mobile and image change');
            mobileImageChange();
            runOnceImageChangeProfile = true;
        }
        //image change when if user clicked image on mobile
        if(windowSize <= 480) {
            $('.profile-image').click(function() {
                mobileImageChange();
            });
        }

    });

    //Profile hover image change
    $(".profile-image").mouseover(function () {
        //console.log('you have mouse over');
        $(this).attr('src', $(this).data("hover"));
    }).mouseout(function () {
        $(this).attr('src', $(this).data("src"));
    });

});



//if onload nav position is within the header container
