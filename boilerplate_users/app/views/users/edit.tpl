{% extends 'layout.tpl' %}


{% block content %}
	<h1>{{  page_title }}</h1>

	<div class="errors">
		{% if errors %}
			<ul class="text-error">
				{% for error in errors %}
					<li>{{ error }}</li>
				{% endfor %}
			</ul>
		{% endif %}
	</div>
	{% include 'users/_form.tpl' %}
{% endblock %}

{% block sidebar %}
	<h2>Editing users</h2>
	This form allows you to edit users in the system
{% endblock %}