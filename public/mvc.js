// add route information
// create and update view function
// wire up the add view function with hash changes
// fetch the view html
// call the controller function
// replace the tokens
// render view html in the view container

;(function(w, d){
    var _viewElement = null;
        _defaultRoute = null;
        _rendered = false

        var jsMvc = function(){
            this._routeMap = {};
        }

        jsMvc.prototype.AddRoute = function(controller, route, template){
            this._routeMap[route] = new routeObj(controller, route, template);
        }

        jsMvc.prototype.Initialize = function(){
            //create update view delegate
            var updateViewDelegate = updateView.bind(this);

            //get view element reference
            _viewElement = d.querySelector('[view]');
            if(!_viewElement) return

            //set a default 
            _defaultRoute = this._routeMap[Object.getOwnPropertyNames(this._routeMap)[0]];

            //wire up the hash change with the update view delegate
            w.onhashchange = updateViewDelegate;

            //call the update view delegate
            updateViewDelegate();
        }

        function updateView(){
            // get the route name from address bar hash
            var pageHash = w.location.hash.replace('#', ''),
            routeName = null,
            routeObj = null;

            routeName = pageHash.replace('/', '');

            _rendered = false;

            //fetch the route object using the route name
            routeObj = this._routeMap[routeName];

            //route name is not found then use default route
            if(!routeObj){
                routeObj = _defaultRoute;
            }

            //render the view html associated with the route
            loadTemplate(routeObj, _viewElement)
            
        }

        function loadTemplate(routeObject, viewElement){
            var xmlhttp;
            if(window.XMLHttpRequest){
                xmlhttp = new XMLHttpRequest();
            }
            else
            {
                xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
            }

            xmlhttp.onreadystatechange = function(){
                if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
                    // load the view
                    console.log(routeObject.template)
                    console.log(xmlhttp.responseText)
                    loadView(routeObject, viewElement, xmlhttp.responseText);
                }
            }

            xmlhttp.open('GET', routeObject.template, true);
            xmlhttp.send();
        }

        function loadView(routeObject, viewElement, viewHtml){
            //create the model object
            var model = {};

            //call the controller function of the route
            routeObject.controller(model);

            //replace the view html tokens with the model properties
            viewHtml = replaceTokens(viewHtml, model)

            //render the view
            if(!_rendered)
            {
                viewElement.innerHTML = viewHtml;
                _rendered = true
            }
        }

        function replaceTokens(viewHtml, model){
            var modelProps = Object.getOwnPropertyNames(model);

            modelProps.forEach(function(element, index, array){
                viewHtml = viewHtml.replace('{{' + element + '}}', model[element]);
            })

            return viewHtml;
        }

        var routeObj = function(c, r, t){
            this.controller = c;
            this.route = r;
            this.template = t;
        }

        w['jsMvc'] = new jsMvc();
})(window, document)