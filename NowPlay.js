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
		xhttp.onreadystatechange = function() {
			if(xhttp.readyState == 4){
				var data = JSON.parse(this.response);
				artist = data.artist;
				title = data.track;
				//ikona wykonawcy
				var icon = document.createElement("img");
				icon.setAttribute("src", "modules/NowPlay/icons/artist.png");
				icon.className = "icon-nowplay";
				wrapper.appendChild(icon);
				//artysta
				var text = document.createElement("p");
				var node = document.createTextNode(artist);
				text.appendChild(node);
				text.className = "artist-nowplay";
				wrapper.appendChild(text);
				//ikona utworu
				var icon = document.createElement("img");
				icon.setAttribute("src", "modules/NowPlay/icons/track.png");
				icon.className = "icon-nowplay";
				wrapper.appendChild(icon);
				//tytul utworu
				text = document.createElement("p");
				node = document.createTextNode(title);
				text.appendChild(node);
				text.className = "title-nowplay";
				wrapper.appendChild(text);
				//okladka
				image = "http://"+self.config.ipyamaha+""+data.albumart_url;
				var poster = document.createElement("img");
				poster.setAttribute("src", image);
				poster.className = "poster-nowplay";
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
		var visible = true;
			setInterval(function () {
        			var xhttp = new XMLHttpRequest();
				xhttp.open("GET", link, true);
				xhttp.send();
				xhttp.onreadystatechange = function() {
					if(xhttp.readyState == 4){
						var data = JSON.parse(this.response);
						var artidNew = data.albumart_id;
						var titleNew = data.track;
						var playback = data.playback;
						var input = data.input;
						if (playback=="play") {
							if (!visible) {
								self.show(1000);
								visible = true;
							}
							switch(input){
								case "spotify":
								if (artidNew!=artidOld && titleNew!=titleOld) {
									artidOld = artidNew;
									titleOld = titleNew;
									self.updateDom(1000);
									Log.log("Spotify NowPlay")
								}
								break;

								case "net_radio":
								if (titleNew!=titleOld) {
									titleOld = titleNew;
									self.updateDom(1000);
									Log.log("NetRadio NowPlay")
								}
								break;

								case "mc_link":
								if (visible) {
									self.hide(1000);
									visible = false;
								}
								break;
							}
						}else{
							if (visible) {
								self.hide(1000);
								visible = false;
							}
						}
					};
				};
			}, 2000);
		},
});
