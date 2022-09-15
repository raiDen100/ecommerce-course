package com.raiden.ecommerce.config;

import com.raiden.ecommerce.entity.Country;
import com.raiden.ecommerce.entity.Product;
import com.raiden.ecommerce.entity.ProductCategory;
import com.raiden.ecommerce.entity.State;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        config.exposeIdsFor(ProductCategory.class);
        config.exposeIdsFor(Product.class);

        HttpMethod[] theUnsupportedActions = {HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PUT};

        disableHttpMethods(Product.class ,config, theUnsupportedActions);
        disableHttpMethods(ProductCategory.class ,config, theUnsupportedActions);
        disableHttpMethods(State.class ,config, theUnsupportedActions);
        disableHttpMethods(Country.class ,config, theUnsupportedActions);
    }

    private void disableHttpMethods(Class classType, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(classType)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
    }

}
