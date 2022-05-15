const feedDisplay = document.querySelector('#feed')

fetch('http://localhost:8000/')
	.then(response => response.json())
	.then(data => {
		data.forEach(fNewses => {
			const NewsItems = "<h3>" + fNewses.heading + "</h3><p>" + fNewses.short + "<br><a href = '"+ fNewses.link +"'>Read More</a></p>"
			feedDisplay.insertAdjacentHTML('beforeend', NewsItems)
		});
	}).catch(err => console.log(err))