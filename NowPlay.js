Module.register("NowPlay",{

	defaults: {
		ipyamaha: "192.168.0.10"
	},

	start: function() {
		this.updater();
	},

	getStyles: function() {
		return ["style_nowplay.css"];
	},

	getDom: function() {
		self = this;
		var wrapper = document.createElement("div");
		wrapper.className = "nowplay";
		var artist, title, image;
		var link = "http://"+this.config.ipyamaha+"/YamahaExtendedControl/v1/netusb/getPlayInfo";
		var xhttp = new XMLHttpRequest();
		xhttp.open("GET", link, true);
		xhttp.send();
		xhttp.onreadystatechange = function(artist, title, image) {
			if(xhttp.readyState == 4){
				var data = JSON.parse(this.response);
				artist = data.artist;
				title = data.track;
				image = "http://"+self.config.ipyamaha+""+data.albumart_url;
				var who = document.createElement("div");
				var poster = document.createElement("img");
				poster.setAttribute("src", image);
				who.innerHTML = "<img height='20px' width='auto' style='filter: invert(100%); margin-right:5px;' src='modules/NowPlay/icons/artist.png'><span class='artist-now'>"+artist+"</span></br><img height='20px' width='auto' style='filter: invert(100%); margin-right:5px;' src='modules/NowPlay/icons/track.png'><span class='title-now'>"+title+"</span>";
				wrapper.appendChild(who);
				wrapper.appendChild(poster);
			}
		}
			
		return wrapper;
		
	},

	updater: function() {
		var link = "http://"+this.config.ipyamaha+"/YamahaExtendedControl/v1/netusb/getPlayInfo";
		var self = this;
		var artidOld;
		var titleOld;
		var kontrolka = 1;

			setInterval(function () {
        			var xhttp = new XMLHttpRequest();
				xhttp.open("GET", link, true);
				xhttp.send();
				xhttp.onreadystatechange = function(artist, title, image) {
					if(xhttp.readyState == 4){
					var data = JSON.parse(this.response);
					var artidNew = data.albumart_id;
					var titleNew = data.track;
					var playback = data.playback;
					var input = data.input;
						if(playback == "play" && kontrolka == 1 && input != "mc_link"){
							kontrolka = 1;
								if(input != "net_radio" && artidNew != artidOld){
									artidOld = artidNew;
									self.updateDom(1000);
									Log.log("REFRESHING DOM NowPlay");
								}else if(input == "net_radio" && titleNew != titleOld){
									titleOld = titleNew;
									self.updateDom(1000);
									Log.log("REFRESHING DOM NowPlay");
								};
						} else if(playback == "play" && kontrolka == 0 && input != "mc_link") {
							kontrolka = 1;
							self.show(1000);
							self.updateDom();
							titleOld = titleNew;
							artidOld = artidNew;
						} else if(playback != "play" && kontrolka == 0) {
							kontrolka = 0;
						} else if(playback != "play" && kontrolka == 1) {
							kontrolka = 0;
							self.hide(1000);
						} else if(input == "mc_link"){
							self.hide(1000);
						};

					};

					};
			}, 2000);
		},
});
